// import axios from "axios"

async function fetchData() {
    const res=await fetch ("http://127.0.0.1:5000/go_links");
    const record=await res.json();
    console.log(record);
    document.getElementById("id").innerHTML=record.data[0].id;
    document.getElementById("actual_url").innerHTML=record.data[0].actual_url;
    document.getElementById("go_link").innerHTML=record.data[0].go_link;
}
fetchData();

const form = document.querySelector(".form-data");
const actual_url = document.querySelector(".actual_url")
const go_link = document.querySelector(".go_link")

const createGoLink = async (actual_url, go_link) => {
    try {
        const url = `http://127.0.0.1:5000/create`;
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
        fetch(url, options)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            chrome.browserAction.setPopup({
                popup:"/add_data"
            });
        });
    }
    catch (error) {
        console.log("ERROR")
        console.log(error)
    }
} 

const handleSubmit = async e => {
    e.preventDefault();
    console.log("about to call CreateGoLink");
    createGoLink(actual_url.value, go_link.value);
    console.log(actual_url.value);
    console.log(go_link.value);
}

form.addEventListener("submit", e => handleSubmit(e));