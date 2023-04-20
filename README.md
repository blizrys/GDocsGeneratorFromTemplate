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
# COMING SOON...

// import Component from 'my-project'

// function App() {
//   return <Component />
// }
```
