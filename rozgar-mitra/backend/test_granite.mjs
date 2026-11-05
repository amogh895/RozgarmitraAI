// Quick Granite live test
async function test() {
  const tr = await fetch("https://iam.cloud.ibm.com/identity/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=kVFet6PuC8w3CMsHrGdhx-0TEIDvUiOKvt4cGNzQo2UZ"
  });
  const { access_token } = await tr.json();
  console.log("IAM OK");
  const gr = await fetch("https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29", {
    method: "POST",
    headers: { Authorization: "Bearer " + access_token, "Content-Type": "application/json" },
    body: JSON.stringify({
      model_id: "ibm/granite-3-3-8b-instruct",
      input: "<|system|>\nYou are a helpful assistant.\n<|user|>\nSay hello in one sentence.\n<|assistant|>",
      parameters: { max_new_tokens: 50, temperature: 0.5 },
      project_id: "d6ee6e75-4532-4087-a218-9895359e8a5b"
    })
  });
  const data = await gr.json();
  console.log("HTTP:", gr.status);
  console.log("Reply:", data?.results?.[0]?.generated_text ?? JSON.stringify(data).substring(0, 300));
}
test().catch(e => console.error("ERROR:", e.message));
