class StatusWatcher
{
    constructor() {
        this.observations = {};
    }

    setObservations(obsv)
    {
        this.observations = obsv;
    }

    setQueryStreamerFunc(func)
    {
        this.queryStreamer = func;
    }

    activate() {

    }

    deactivate() {
        
    }


}
