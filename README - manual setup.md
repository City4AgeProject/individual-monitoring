# individual-monitoring-Belit
Individual monitoring dashboard app, Belit version with Hibernate ORM and support for assessments. 

Deployment on Glassfish instructions - MANUAL :
---------------------------------------------------
1. If you don't have, install now Java jdk1.8.0_112
2. If you don't have, install now Glassfish 4.1.1 (glassfish4 folder must be located in C:\glassfish-4.1.1\)
    2.1. If you dont have add postgresql-42.0.0.jre6 (can be found inside projects build/ folder) jar to glassfish4\glassfish\domains\domain1\lib 
    2.2. In glassfish4/bin under Windows operating system delete ASADMIN file (the one without extension!)
    2.3. If you dont have add guava-18.0 (can be found inside projects build/ folder) jar to \glassfish4\glassfish\modules
3.Add resources (xml located inside projects build/ folder) to Glassfish from glassfish4/bin:
  First copy glassfish-resources.xml to glassfish4/bin folder then run:
 	asadmin add-resources ...\glassfish-resources.xml
4.	Start Glassfish 4.1.1:
	asadmin start-domain
5. If you don't have, install now Apache Maven 3.3.9
6. Deploy application (run from project's root dir):
	mvn clean install --pl build glassfish:deploy
or, in case old version of app is already deployed on Glassfish 4.1.1:
	mvn clean install --pl build glassfish:redeploy
7. Open in browser:
	http://localhost:8080/C4A-dashboard/

--------------------------------------------
Running unit tests from Eclipse IDE:

1. If you don't have, install now Java jdk1.8.0_112
2. If you don't have, install now Eclipse Neon.1a Release (4.6.1)
3. Import project into workspace from file system using Import > Existing projects into workspace
4. Run unit tests from src/test/java packages