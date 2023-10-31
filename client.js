function analyze() {
    fetch(insertEndPoint, {
        method: "POST",
        mode: "cors"
    })
        .then(res => res.json())
        .then(json => console.log(json))   
}
