# Overview

## Structure
```text
database                           # Data Layer: PostgreSQL configuration and scripts
├── README.md                      # Database overview and structure 
├── config.py                      # DB connection strings and environment settings
├── main.py                        # Management script for DB init and migrations
└── *.sql                          # SQL scripts: Schema(Create), Seed(Insert), Ops(Queries)
``` 
## ER Diagram
<p align="left">
  <img width="918" alt="ER diagram" src="docs/others/Database ER Diagram.jpg" style="box-shadow: 5px 5px 10px rgba(0,0,0,0.5)";>
</p>
Diagram might need to be updated 