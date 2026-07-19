async function parse(file){
    
    const fileContent = await file.text();

    const matchingPattern = /import\s(?:.*?)from\s['"]((?:[^'"\\]|\\.)+)['"]/gs;
    const currentParse = [...fileContent.matchAll(matchingPattern)];
    
    let dependencies = new Set(currentParse.map(element => cleanPath(element[1])));
   
    return [...dependencies];

}

function cleanPath(filePath){
    
    return filePath.startsWith('./') ? filePath.slice(2) : filePath ;
}

export default parse;
