class Client{
    constructor(port){
        this.defaultPort = 8081;
        this.port = port || this.defaultPort;
    }

    getRequest(request){
        
        var requestPort = this.port;
        var request = new XMLHttpRequest();
        request.open("get", "http://localhost:" + requestPort + "/" + requestString, true);

        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        request.send();
    }

    getReply(data){

        console.log(data.target.response);

        return data.target.response;
    }
} 