import parse from "./parser.js" ;
import visualize from "./graph.js" ;

function createFileStore(){
    const fileData = new Map;

    return{

        setFiles(FileList){

            fileData.clear();    
            for(let file of [...FileList]){
        
                if(isValid(file.name.toLowerCase())){
                    fileData.set(file.name, { object: file, size: file.size, dependencies: [] })        
                }
            }

        },

        async parseAll(){
            await Promise.all(
                [...fileData.values()].map(async data => {
                    data.dependencies = await parse(data.object);
                })
            )
        },

        getFiles(){
            return fileData;
        }
    };
}

window.addEventListener('dragover', (e) => {
    e.preventDefault();
});

window.addEventListener('drop', (e) => {
    e.preventDefault();
});

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    document.getElementById("fileUpload").addEventListener(eventName , preventDefaults , false);
})

document.getElementById("fileUpload").addEventListener('keydown', event=>{
    if(event.key == 'Enter' || event.key == ' '){
        event.preventDefault();
        document.getElementById('dropZone').click();
    }
})

let fileData = createFileStore();


document.getElementById("fileUpload").addEventListener("drop",event => {fileData.setFiles(event.dataTransfer.files); appendFileDetails();submitButton(fileData.getFiles(),event);});

document.getElementById("dropZone").addEventListener("change",event => {fileData.setFiles(event.target.files); appendFileDetails();submitButton(fileData.getFiles(),event);});

document.getElementById("sub").addEventListener("click",(event)=>{main(event)});


function preventDefaults(eventId){
    eventId.preventDefault();
    eventId.stopPropagation();
}
async function main(event){
    if(fileData.getFiles().size==0){
        event.preventDefault();
        event.stopPropagation();
    }
    else{
    updateScreen();
    
    await fileData.parseAll();
    
    visualize (fileData.getFiles());
    
    }
}


function isValid(name){

    const EXTENTIONS = ['.txt','.js'];
    return EXTENTIONS.some(ext => name.endsWith(ext));
}

function submitButton(files,event){
    const sub = document.getElementById("sub");
    if(files.size!=0)
        sub.classList.remove("cursor-block");
    else{
        sub.classList.add("cursor-block");
        event.preventDefault();
        event.stopPropagation();
    }
}


function appendFileDetails(){
    const files = fileData.getFiles();

    const label = document.getElementById("list-label");
    label.textContent = "Files Selected"

    const disp = document.getElementById("fileList");
    disp.innerHTML='';
    for(let [file,data] of files){
 
        const row = document.createElement("div");
        row.classList.add('name-size');

        const fileName = document.createElement("span");
        fileName.textContent = file;

        const fileSize = document.createElement("span");
        fileSize.textContent = data.size;

        row.appendChild(fileName);
        row.appendChild(fileSize);
        disp.appendChild(row);
    }
    
}

function updateScreen(){

    const input = document.getElementById("fileUpload");
    input.classList.replace("Files-Before" , "Files-After");
    const label = document.getElementById("inputLabel");
    const beforeSub = (document.getElementById("beforeSub"));
    if(beforeSub)
        label.removeChild(beforeSub);
    const reset = document.getElementById("reset");
    reset.classList.remove("display-block");

    const intro = document.getElementById("introText");
    intro.classList.add("intro-out");
}
