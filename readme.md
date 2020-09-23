# Batch updater
### 1.0.0 ###

## Description ##

Script for update a high number of registers, without blocking backends.

Backend scripts are not included. Needs 2 scripts:

- Get the total number of registers
- Update register

The scripts URI is defined in `.env` file (see `.env_example`)

`URI_TOTAL_REGISTERS`

Must be a JSON answer:
``` 
{'total':integer, 'registers': optional array}
```

`URI_UPDATE_REGISTER`

Must be a JSON answer:
``` 
{'status':'Accepted/Failed', 'register': 'JSON for Accepted | error description for Failed`}
```

Script does a pause before proccessing next batch or register, you can configure the time (milliseconds) with the field `STEP_TIME ` on `.env` file.

## Usage ##

`npm install`

`npm start`