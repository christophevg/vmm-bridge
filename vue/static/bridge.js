// The Bridge between the VueX store and (other stores also connected to) the
// MQTT overlay network. It is implemented as a Vue component, visually
// indicating that we're connected to the overlay network and its own store.

Vue.component( "Bridge", {
  template : `
<span>
  <span v-if="connected">
    <v-icon color="green" large>check_circle</v-icon>
  </span>
  <span v-else>
    <v-icon color="red" large>remove_circle</v-icon>
  </span>
</span>`,
  computed: {
    connected: function() {
      return store.getters.network().connected;
    }
  },
  methods: {
    connect : function() {
      var mqtt     = { hostname: "localhost", port: 9001 },
          clientId = "web";
      console.log("brdige: connect to", mqtt);
      client = new Paho.MQTT.Client(mqtt.hostname, mqtt.port, clientId);

      client.onConnectionLost = this.onConnectionLost;
      client.onMessageArrived = this.onMessageArrived;

      var options = {
        useSSL     : false,
        onSuccess  : this.onConnect,
        onFailure  : this.onFailure,
        reconnect  : true,
      }

      if(mqtt.username) {
        options["userName"] = mqtt.username;
        options["password"] = mqtt.password;
      }

      client.connect(options);
      
      store.commit("networkClient", client);
    },
    onConnectionLost : function onConnectionLost(responseObject) {
      store.commit("networkConnected", false);
      if (responseObject.errorCode !== 0) {
        console.log("bridge: connection lost:", responseObject);
      }
      app.$notify({
        group: "notifications",
        title: "Bridge: network offline",
        text:  responseObject.errorMessage,
        type:  "warning",
        duration: 10000
      });
    },
    onMessageArrived: function onMessageArrived(message) {
      try {
        var topic = message.destinationName.split("/"),
            event = JSON.parse(message.payloadString);
        console.log("bridge: message arrived:", topic, event);
        // store.commit("newMessage", { "topic" : topic, "payload" : event} );
      } catch(err) {
        console.log("bridge: Failed to parse JSON message: ", err, topic, event);
        return;
      }
    },
    onConnect: function onConnect() {
      store.commit("networkConnected", true);
      store.getters.network().client.subscribe("#");
      console.log("bridge: conected to MQTT network");
      app.$notify({
        group: "notifications",
        title: "Bridge: network online",
        text:  "Connected to the MQTT network.",
        type:  "success",
        duration: 10000
      });
    },
    onFailure : function onFailure(invocationContext, errorCode, errorMessage) {
      store.commit("networkConnected", false);
      console.log("bridge: failure:", errorMessage);
      app.$notify({
        group: "notifications",
        title: "Bridge: network offline",
        text:  errorMessage,
        type:  "warning",
        duration: 10000
      });
    }
  },
  created: function() {
    this.connect()
  },
  data: function() {
    return {}
  }
});

store.registerModule("Bridge", {
  state: {
    network : {
      client: null,
      connected: false
    }
  },
  mutations: {
    networkClient: function(state, client) {
      state.network.client = client;
    },
    networkConnected: function(state, connected) {
      state.network.connected = connected;
    }
  },
  actions: {
    publish: function(context, event) {
      if(! store.getters.network().connected ) {
        console.log("bridge: can't publish messages when not connected");
        return;
      }
      var message = new Paho.MQTT.Message(JSON.stringify(event.message));
      message.destinationName = event.topic;
      context.getters.network().client.send(message);      
    }
  },
  getters: {
    network: function(state) {
      return function() {
        return state.network;
      }
    }
  }
});
