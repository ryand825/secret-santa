const host = document.getElementById("host");
const join1 = document.getElementById("join1");
const join2 = document.getElementById("join2");
const join3 = document.getElementById("join3");
const join4 = document.getElementById("join4");
const key = document.getElementById("access-key");
let sessionId = "";

(async () => {
  // First person hosts
  const hostRaw = await fetch("/api/session/host", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ displayName: "Santa Host" })
  });
  const hostResponse = await hostRaw.json();
  const { accessKey } = hostResponse;
  sessionId = hostResponse.sessionId;
  key.innerHTML = "Access Key - " + accessKey;
  host.innerHTML = hostResponse.host;

  // Second person joins with access Key
  const join1Raw = await fetch("/api/session/join", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ displayName: "Santa2", accessKey: accessKey })
  });
  const join1Response = await join1Raw.json();
  join1.innerHTML = join1Response.thisSanta;

  // Third person joins with access Key
  const join2Raw = await fetch("/api/session/join", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ displayName: "Santa3", accessKey })
  });
  const join2Response = await join2Raw.json();
  join2.innerHTML = join2Response.thisSanta;

  // Fourth person joins with access Key
  const join3Raw = await fetch("/api/session/join", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ displayName: "Santa4", accessKey })
  });
  const join3Response = await join3Raw.json();
  join3.innerHTML = join3Response.thisSanta;

  // Last person joins with access Key
  const join4Raw = await fetch("/api/session/join", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ displayName: "Santa5", accessKey })
  });
  const join4Response = await join4Raw.json();
  join4.innerHTML = join4Response.thisSanta;

  await shuffleFunction();

  const statusRaw = await fetch(
    // Get request that returns data for the specified user
    // GET requests use query params instead of the body object
    `/api/session/status/${sessionId}/santa%20host`, // <-- query params
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }
  );
  const statusResponse = await statusRaw.json();
  console.log(statusResponse);
})();

const shuffleFunction = () => {
  return fetch("/api/session/shuffle", {
    // fetch using .then instead of "async/await"
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ sessionId: sessionId })
  })
    .then(res => res.json())
    .then(json => {
      host.innerHTML = `${json[0].name} gives to ${json[0].giveTo}`;
      join1.innerHTML = `${json[1].name} gives to ${json[1].giveTo}`;
      join2.innerHTML = `${json[2].name} gives to ${json[2].giveTo}`;
      join3.innerHTML = `${json[3].name} gives to ${json[3].giveTo}`;
      join4.innerHTML = `${json[4].name} gives to ${json[4].giveTo}`;
    });
};

// }

// fetch("/api/session/test")
//   .then(res => res.json())
//   .then(json => console.log(json));
