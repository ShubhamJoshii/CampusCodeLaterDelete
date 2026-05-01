import React from 'react'
import { Oval } from 'react-loader-spinner';
import { useSelector } from 'react-redux'

const SubmitBtn = ({ text }) => {
    const { status } = useSelector((state) => state.user);
    return <div className='submitBtn'>
        {
            status == "loading" ? <Oval height="22" width="18" color="white" wrapperStyle={{}} visible={true} ariaLabel="oval-loading" secondaryColor="white" strokeWidth={8} strokeWidthSecondary={8} /> :
                <input type="submit" className='' value={text} />
        }
    </div>
}

export default SubmitBtn