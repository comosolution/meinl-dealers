@echo off
cd /d C:\inetpub\dealerdev.meinl.loc

set NODE_OPTIONS=--use-system-ca
npm run start -- --port 3001
