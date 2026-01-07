@echo off
cd /d C:\inetpub\dealer.meinl.de

set NODE_OPTIONS=--use-system-ca
npm run start -- --port 3001
