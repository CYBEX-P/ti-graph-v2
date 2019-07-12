/*import React, { Component } from 'react';
import Button from './../Button/Button';
import axios, {post} from 'axios';

class Import_json extends Component{
    constructor(props){
        super(props);
        this.state ={
            data:''
        }
    }
 


/*onChange(e){
    let files = e.target.files;
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (e) =>{
    console.warn('data', e.target.result)
    axios
    .post('/import_json', {
        data: content
    }).then(({data}) => {console.log(data)})
  //return "submitted"

}*/
/*onChange(file) {
  
    //var formData = new FormData();
    
    
    axios
    .post('/import_json', {
      // content-type header should not be specified!
      
      body: file,
    })
      .then(response => response.json())
      .then(success => {
        // Do something with the successful response
      })
      .catch(error => console.log(error)
    );
  }


render(){
    return(
        <form>
            <div>
            <input type= "file" onChange = {(file)=>this.onChange(file)}/>
            </div>
            <div >
            <Button type ="button" width = "45%">Import JSON</Button>
            </div>
        </form>
    )
}
}

export default Import_json;*/
import React,{Component} from 'react'
import axios, { post } from 'axios';

class Import_json extends React.Component {

  state ={
      file:null
  }
  handleFile(e){
      let file = e.target.files[0]
      this.setState({file:file})
  }
  handleUpload(e){
      let file = this.state.file
      let formData = new FormData()
      //formData.append({[e.target.name]: e.target.value })
      formData.append('data',file)
      axios({
          url:'/import_json',
          method:"POST",
          data: formData,
          config:{ headers: {'Content-Type':'multipart/form-data, boundary=${form._boundary}'}}
  
      }).then((res) =>{
        console.log(res)
      },(err)=>{

      })
  }
  render(){
      return(
          <form>
          <div>
              <input type = "file" onChange={(e)=>this.handleFile(e)} />
          </div>
          <div>
              <button type = "button" onClick={(e)=>this.handleUpload(e)}>Upload</button>
          </div>
          </form>
      )
  }
}



export default Import_json;