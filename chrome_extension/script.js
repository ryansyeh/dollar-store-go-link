async function getCurrentTab() {
    return chrome.tabs.query({ active: true, currentWindow: true});
}

async function getCurrentUrl() {
    const activeTab = await getCurrentTab();
    console.log(activeTab)
    const activeUrl = activeTab[0].url;
    console.log({activeUrl});
    document.querySelector(".actual_url").value = activeUrl
}

const go = async () => await getCurrentUrl();
go();

const original = document.querySelector(".original");
const form = document.querySelector(".form-data");
const actual_url = document.querySelector(".actual_url")
const go_link = document.querySelector(".go_link")
const success_screen = document.querySelector(".success")
const created_go_link = document.querySelector(".created_go_link")

const createGoLink = async (actual_url, go_link) => {
    try {
        const url = `http://cheangmbrian.pythonanywhere.com/create`;
        const options = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            go_link: go_link,
            actual_url: actual_url,
          })
        };
        response = await fetch(url, options);
        return response;
    }
    catch (error) {
        console.log("ERROR")
        console.log(error)
    }
} 

const handleSubmit = async e => {
    e.preventDefault();
    const response = await createGoLink(actual_url.value, go_link.value);
    console.log(response)
    const record = await response.json();
    console.log(record)
    const success = record.data[0].success
    if (success == true){
        const go_link = record.data[0].go_link
        success_screen.style.display="block"
        created_go_link.innerHTML += `<a href="https://${go_link}" target="_blank" id="link_to_copy">https://${go_link}</p>`
        original.style.display="none"
    }
}

const copyLink = async () => {
  // Get the text field
  var copyText = await document.getElementById("link_to_copy");

  console.log(copyText)
  console.log(copyText.href)



   // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.href).then(() => {
    alert(`successfully copied ${copyText.href}`);
  })
}

form.addEventListener("submit", e => handleSubmit(e));
document.getElementById("copy_link_btn").addEventListener("click", copyLink);
