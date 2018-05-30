Terrys new ReactJS Framework and Orange Blocks showcase.

This repo contains an implementation Terrys new ReactJS scaffolding, along with a Demo Property Management webapp.

It originally started life as a framework to base a new example implementation of a previous project - the Tactical Combat Casualty Care (TCCC) functionality; a system designed to help medics in the battlezone track and deal with casualities. 

I've repurposed it a little for a more generalized framework for writing Web apps that use ReactJs as the front end and Azure Mobile App DataServices as the cloud datastore. The main feature point is being able to capture data _OFFLINE_ for transmission/synchronisation when conectivity is available; very useful on a battlefield, a little less so for estate agents!.

I've left the old TCCCReactWebApp in the repository, but taken it out of the solution.

It uses the following architecture 

<div style="text-align:center;border:solid 1px black;border-radius:5px">Browser Based ASP.NET Core MVC WebApp using Typescript, ReactJs, Redux, Bootstrap, Jquery (OrangeBlocksWebApp) </div>
<div style="text-align:center;"><span>&darr;</span></div>
<div style="text-align:center;border:solid 1px black;border-radius:5px">On device offline storage using SQLite (ReactFramworkLogic), synchronizes on connection to.. </div>
<div style="text-align:center;"><span>&darr;</span></div>
<div style="text-align:center;border:solid 1px black;border-radius:5px">Azure Web App Service (ReactFrameworkService).
Its currently hosted at http://reacttccc.azurewebsites.net </div>
<div style="text-align:center;"><span>&darr;</span></div>
<div style="text-align:center;border:solid 1px black;border-radius:5px">Azure SQL Database using TableAPI</div>


##Things I would have liked to have included.
1. More unit tests...
1. More scaleable Search. At the moment the filtering is done on the client, which is fine for a small number of properties (<100) but would need to be server side. Look at using OData filtering mechanics?
1. Nicer Loading... notifications on the Property List.
1. Scalability - more work here in that the Framework is initially designed to cope with 1000s of cases, not 100,000s. The Azure Mobile App service _should_ reduce the transfer payload - it should be smart enough to only transmit the required changes... but that remains to be seen.



