Terrys new ReactJS Framework and Orange Blocks showcase.

This repo contains an implementation Terrys new ReactJS scaffolding, along with a Demo Property Management webapp.

It originally started life as a framework to base a new example implementation of the Tactical Combat Casualty Care (TCCC) functionality; 
a system designed to help medics in the battlezone track and deal with casualities. 
I've repurposed it a little for a more generalized framework for writing Web apps that use ReactJs as the front end and Azure Mobile App DataServices as the cloud datastore.
I've left the old TCCCReactWebApp in the repository, but taken it out of the solution.

It uses the following architecture 

||:Browser Based ASP.NET Core MVC WebApp using Typescript, ReactJs, Redux, Bootstrap, Jquery :||
||<span>&darr;</span>||
||Azure Web App Service (ReactFrameowkrService)||
||Azure SQL Database using TableAPI||


##Things I would have liked to have included.
1 More scaleable Search. At the moment the filtering is done on the client, which is fine for a small number of properties (<100) but would need to be server side. Look at using OData filtering mechanics.
2 Nicer Loading... notifications on the Property List.
3 Scalability - more work here in that the Framework is initially designed to cope with 1000s of cases, not 100,000s. The Azure Mobile App service _should_ reduce the payload
but that remains to be seen.



