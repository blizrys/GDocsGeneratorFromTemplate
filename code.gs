function main(){
  /////////////////// README ///////////////////
  // Prerequiste before running this script
  // 1. Create Google Document Template with these defined key
  //    - {{folderName}}
  //    - {{fileName}}
  //    - {{fileExtension}}
  //    - {{fileImage}}
  // 2. Put images into folder in google drive
  // 3. Config these parameters
  
  const TEMPLATE_ID = '1tPAQGCNU7asCIvxv4JZveYMToQrYag4lABK7bd0T3mY'
  const RESOURCE_FOLDER_ID = '1dbV8DB-zmlsPlCvaSOlpgp7Nra7T8Jh6'
  const DESTINATION_FOLDER_ID = '1H1D0USDTUhf9AxQ-vZq070b2B2SrdvhN'

  // 4. Run 'main' function and enjoy
  //////////////////////////////////////////////
  generateGoogleDocs(TEMPLATE_ID,RESOURCE_FOLDER_ID,DESTINATION_FOLDER_ID)
}

function generateGoogleDocs(TEMPLATE_ID,RESOURCE_FOLDER_ID,DESTINATION_FOLDER_ID){
  console.log(Session.getActiveUser().getEmail())
  
  try {
    // Load template file (check if it exists)
    var template_file = DriveApp.getFileById(TEMPLATE_ID);
    console.log('TEMPLATE_ID:'+ TEMPLATE_ID + " (" + template_file.getName() + template_file.getMimeType() + ")")
  }
  catch(err) {
    console.error("Missing/Incorrect Parameters Given\n" + err)
    return "DocGenerate - Unsuccessful : Missing/Incorrect TEMPLATE_ID" + " (" + TEMPLATE_ID + ")"
  } 
  
  try {
    // Load Resource folder
    var rss_folder = DriveApp.getFolderById(RESOURCE_FOLDER_ID);
    console.log('RESOURCE_FOLDER_ID:'+ RESOURCE_FOLDER_ID + " (" + rss_folder.getName() + ")")
  }
  catch(err) {
    console.error("Missing/Incorrect Parameters Given\n" + err)
    return "DocGenerate - Unsuccessful : Missing/Incorrect RESOURCE_FOLDER_ID" + " (" + RESOURCE_FOLDER_ID + ")"
  } 

  try {
    // Load Destination folder
    var dest_folder = DriveApp.getFolderById(DESTINATION_FOLDER_ID);
    console.log('DESTINATION_FOLDER_ID:'+ DESTINATION_FOLDER_ID + " (" + dest_folder.getName() + ")")
  }
  catch(err) {
    console.error("Missing/Incorrect Parameters Given\n" + err)
    return "DocGenerate - Unsuccessful : Missing/Incorrect DESTINATION_FOLDER_ID" + " (" + DESTINATION_FOLDER_ID + ")"
  } 

  // Create generate folder with timestamp under destination
  var formattedDate = Utilities.formatDate(new Date(), "GMT", "yyyyMMdd'T'HHmmssz");
  gen_folder = dest_folder.createFolder('gen_' + formattedDate);

  // Get Resources Files and generate files
  rss_folder_name = rss_folder.getName()
  rss_folder_files = rss_folder.getFiles();
  while (rss_folder_files.hasNext()) {
    var data_file = rss_folder_files.next();
    var [file_name, file_ext] = splitLastOccurrence(data_file.getName(), '.');
    if(file_ext == null){
      file_ext = splitLastOccurrence(data_file.getMimeType(), '/')[1]
    }

    // Generate file from template
    var new_file = DriveApp.getFileById(TEMPLATE_ID).makeCopy(rss_folder_name + '-' + file_name, gen_folder);

    // Open a document and replace value with defined key.
    var doc = DocumentApp.openById(new_file.getId());
    var doc_body = doc.getBody();

    // Defined key : {{folderName}}
    doc_body.replaceText('{{folderName}}',rss_folder_name); 

    // Defined key : {{fileName}}
    doc_body.replaceText('{{fileName}}',file_name); 

    // Defined key : {{fileExtension}}
    doc_body.replaceText('{{fileExtension}}',file_ext); 

    // Defined key : {{fileImage}}
    var doc_body_images = doc_body.getImages();
    for (var i = 0; i < doc_body_images.length; i = i + 1) {
      if(doc_body_images[i].getAltTitle() == "{{fileImage}}"){
        var placeholder_image = doc_body_images[i];
        var placeholder_image_height = placeholder_image.getHeight();
        var placeholder_image_width = placeholder_image.getWidth();
        var placeholder_image_paragraph = doc_body_images[i].getParent().asParagraph();
        placeholder_image_paragraph.clear();
        new_img = placeholder_image_paragraph.appendInlineImage(data_file.getBlob());
        new_img.setHeight(placeholder_image_height);
        new_img.setWidth(placeholder_image_width);
      }
    }
  }
  console.info("DocGenerate - Successful : "+ gen_folder.getUrl())
  return "DocGenerate - Successful : "+ gen_folder.getUrl()
}

function splitLastOccurrence(str, substring) {
  const lastIndex = str.lastIndexOf(substring);
  if(lastIndex == -1){
    return [str, null]
  }
  const before = str.slice(0, lastIndex);
  const after = str.slice(lastIndex + 1);

  return [before, after];
}

function doGet(e){
  return HtmlService.createTemplateFromFile("index").evaluate();
}
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}
