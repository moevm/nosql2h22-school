import React, { useState } from 'react';
import './Admin.css';
import Dropdown from '../Dropdown/Dropdown';
import Tables from "../../helpers/Consts"



function Admin() {
    const [selected, onSelectedChange] = useState(Tables[0]);
    console.log(selected)

    return (
        <div className="admin-wrapper">
            <div>
                <button type="submit" className="admin-button">Резервное копирование</button>
            </div>
            <div className='dropdown'>
                <Dropdown 
                selected={selected} 
                onSelectedChange={onSelectedChange} 
                dropdownOptions={Tables}/>
            </div>
            <div>
                <button type="submit" className="admin-button-copy">Импорт</button>
            </div>
            <div>
                <button type="submit" className="admin-button-copy">Экспорт</button>
            </div>
        </div>
    )
}


export default Admin;   