using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ReactFrameworkLogic.DataPoints
{
    public static class Utilities
    {
        static DateTime epoch = new DateTime(2018, 01, 01, 0, 0, 0, 0, DateTimeKind.Utc);
        static string lastName = string.Empty;
        public async static Task<string> CookNewCaseNameAsync()
        {
            string newname = lastName;
            while (newname == lastName)
            {
                DateTime newDate = DateTime.UtcNow;
                var span = newDate.Subtract(epoch);
                newname = span.Ticks.ToString("X7").PadLeft(8, '0');
                if (newname == lastName)
                {
                    await Task.Delay(1000);
                }
            }
            lastName = newname;
            return newname;
        }

        public static string CookNewCaseName()
        {
            var t = CookNewCaseNameAsync();
            t.Wait();
            return t.Result;
        }

    }
}
