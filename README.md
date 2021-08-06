Simple Node.js web app for tracking family spending.

Designed to work with MySQL database.

Requires following Node.js modules:
- mysql
- express
- body-parser
- chart.js

Family members ("persons") and spending categories lists are currently not editable from the GUI. They are defined in .js files in "preparations" folder.

Files in preparations folder:
- "schema.sql" : SQL-script creating all required DB tables
- "structure_only.js" : sets persons and categories in DB
- "insert_data.js" : the same as above AND inserts automatically generated spending data (for testing purposes).