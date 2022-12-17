import React, { useState, useEffect } from "react"

import './Dropdown.css';

const Dropdown = ({ dropdownOptions, selected, onSelectedChange }) => {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        document.body.addEventListener("click", () => {
            console.log("CLICK")
        })
    }, [])
    console.log(dropdownOptions)
    const renderedOptions = dropdownOptions.map(option => {
        if (option.value === selected.value) {
            return null
        }

        return (
            <div
                key={option.value}
                className="item"
                onClick={() => onSelectedChange(option)}
            >
                {option.label}
            </div>
        )
    })

    return (
        <div className="ui_form">
            <div className="field">
                <div
                    onClick={() => setOpen(!open)}
                    className={`selection${open ? "_visible" : ""}`}
                >
                    <div className="text">{selected.label}</div>
                    <div
                        onClick={() => setOpen(!open)}
                        className={`menu${open ? "_visible" : ""}`}
                    >
                        {renderedOptions}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dropdown