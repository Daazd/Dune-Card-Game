class EventSource {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    createEventSource(endpoint) {
        const url = `${this.baseURL}${endpoint}`;
        const eventSource = new EventSource(url, {
            withCredentials: true
        });

        eventSource.onopen = () => {
            console.log('SSE connection established');
        };

        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            eventSource.close();
        };

        return eventSource;
    }

    subscribeToEvents(callback) {
        const eventSource = this.createEventSource('/api/events/');
        
        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                callback(data);
            } catch (error) {
                console.error('Error parsing event data:', error);
            }
        };

        return () => {
            console.log('Cleaning up event source');
            eventSource.close();
        };
    }
}

export default new EventSource('http://localhost:8000');