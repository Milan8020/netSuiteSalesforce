// Start Trigger

// trigger executed after Account record is inserted...

trigger AccountTrigger on Account (after insert) {

        System.enqueueJob(new WriteNetSuiteCompanyQueueable(Trigger.New));

}

// End Trigger