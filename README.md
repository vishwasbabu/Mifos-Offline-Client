Mifos Offline
=============

GUI
-----------
### XUL


Database
------------

### BaseX - Native xml database



Installation
-----------

1) Install XUL , instructions located at https://developer.mozilla.org/en/xulrunner_1.9_release_notes
2) Run mifos offline with command "xulrunner application.ini" (ensure your working directory is Mifos-Offline-Client/flamingo)


Usage
-----
 1) Data entry operator/Branch manager registers with the offline client by enetring his mifos username,password and url of their mifos instance
 2) Upon sucessfull login, a hash of the users password is stored in his home directory,future logins do not require an internet connection
 3) after logging in,user is taken to "Today" tab where he can fetch collection sheets for any loan officers in his branch (when internet is available)
 4) While offline,he can enter repayments, fees etc and save them 
 5) All saved and unsynced data from previous days is visible under "Unsynced" tab. User can additionaly modify any of the unsynced records and sync them when an 
 internet connection is available
 6)Once synced, records are archived and visible under "Synced" tab. User can then optionally delete these archived records
 7)The "Future" tab can be used to fetch collection sheet data for future dates. Records displayed in this tab are non editable. 
 For purposes of ensuring data integrity,only collection sheets for the next "N-1" days should be downloaded, where "N" is the loan repayment frequency
in days 

Testing
-------




Contributing
------------

1. Fork it.