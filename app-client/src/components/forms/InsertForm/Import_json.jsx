
import React, {useContext} from 'react';
import axios from 'axios';
import DataContext from '../../App/DataContext';


const Import_json = props => {
    const {  setNeo4jData } = useContext(DataContext);
   // const { dispatchModal, setError } = useContext(ModalContext);
    //const { setLoading } = useContext(MenuContext);
    

   function onChange(e)
    {
        const data = new FormData()
        data.append('file', e.target.files[0])
        axios
        .post('/import_json', data,{   
        })
        .then(res => {
            console.log(res.data)
            setNeo4jData(res.data)
        })
    
    }
    return(
        <div>
        <form >
            <label>Import JSON</label>
            <input type ="file" name="file" onChange={onChange}/> 
          
       </form>
        </div> 
    )
}
export default Import_json;
  
