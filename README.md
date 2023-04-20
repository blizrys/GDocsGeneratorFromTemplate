# GDocsGeneratorFromTemplate
This tool help generate mutiple google document using a template google document and list of image files

[![Coding Language](https://img.shields.io/badge/google--apps--script-1.0-brightgreen)](https://script.google.com/home)


## Usage/Examples

Generally, this tool is ready to used without any installation. 

The tools has been published on as Google Web App.  Permission to google drive is REQUIRED for reading template & images source and generate files at the destination.

### Summary steps
1.  Create Google Document template. [Example File](https://docs.google.com/document/d/1hsmEoTRz36H2lWyIX4pGighWt6bktNWcj4xUM6AGjJ4/edit?usp=sharing)  
    The script will replace these markers
      + {{folderName}}
      + {{fileName}}
      + {{fileExt}}
      + {{fileImage}} : Image need to be specified in "Alt Text" field for the image to be replace
   
    ![alt text](https://github.com/blizrys/GDocsGeneratorFromTemplate/blob/main/screenshot/ss_filetemplate.png?raw=true)
    ![alt text](https://github.com/blizrys/GDocsGeneratorFromTemplate/blob/main/screenshot/ss_fileImage.png?raw=true)
  
2. Store Images in Google Drive Folder. [Example Folders](https://drive.google.com/drive/folders/1caLCLnh8b-JhnrAw5rZZmbYwBljEpu1o?usp=sharing)
3. Use web-app tool [LINK](https://script.google.com/macros/s/AKfycbyQIf5-7ThGKiaax0YweeMmVzjqKaYW1JR5p67Vi9ofjVYI4sYQWRmBBjOZD35tL_FVww/exec) to generate all the files. STANDUP STRECH & GO GRAB COFFEE. YOUR JOB IS DONE :)
  ![App Screenshot](https://github.com/blizrys/GDocsGeneratorFromTemplate/blob/main/screenshot/ss_webapp.png?raw=true)
    How to get the URL parameters.
    + Template URL  
    ![alt text](https://github.com/blizrys/GDocsGeneratorFromTemplate/blob/main/screenshot/ss_template_url.png?raw=true)
    + Folder URL  
    ![alt text](https://github.com/blizrys/GDocsGeneratorFromTemplate/blob/main/screenshot/ss_folder_url.png?raw=true)

### Output

[Example Output](https://drive.google.com/drive/folders/1rHJthdDbpgzIwBXlnslWYgIjESApXQ7T) 

![App Screenshot](https://github.com/blizrys/GDocsGeneratorFromTemplate/blob/main/screenshot/ss_output.png?raw=true)

### Permission

First time using web-app, you might see these prompt which you need to accept to allow permission.  
You can also clone the code from this github and use it in your personal google app script to make your own scipt.
But please leave some credit to me :). Thank you.

![App Screenshot](https://github.com/blizrys/GDocsGeneratorFromTemplate/blob/main/screenshot/ss_permission.png?raw=true)
![App Screenshot](https://github.com/blizrys/GDocsGeneratorFromTemplate/blob/main/screenshot/ss_accept_untrusted.png?raw=true)
## Code Explained

```javascript
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
```
