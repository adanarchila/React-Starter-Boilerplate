import React from 'react'

const BtnDefault = (props) => {
    return (
      <div>
        <button className='btn btn-primary' onClick={props.onClick}>
        { props.btnText }
        </button>
      </div>
    )
}

export default BtnDefault
