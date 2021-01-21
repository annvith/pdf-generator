import React, { useState } from "react";
import Axios from "axios";
import "./App.css";

function App() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [itemA, setItemA] = useState(0);
    const [itemB, setItemB] = useState(0);
    const [itemC, setItemC] = useState(0);
    const [link, setLink] = useState("");

    const handleCreate = (e) => {
        e.preventDefault();
        console.log("handleCreate function");
         
        Axios.post("http://localhost:4000/generate-pdf", {
            name: name,
            email: email,
            itemA: itemA,
            itemB: itemB,
            itemC: itemC,
        })
            .then(console.log(`POST data sent: "${name}", "${email}"`))
            .then((res) => {
                console.log(`Response received ${res.data}`);
                setLink(res.data);
                console.log(link);
            });
    };

    const handleDownload = (e) => {
        e.preventDefault();
        window.location.href = link;
    };

    return (
        <>
            <form className='m-5 px-5 container' style={{ width: "450px" }}>
                <div className='form-group'>
                    <label for='exampleInputName'>Name</label>
                    <input
                        type='text'
                        className='form-control'
                        id='exampleInputName'
                        placeholder='Enter name'
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                    />
                </div>
                <div className='form-group'>
                    <label for='exampleInputEmail1'>Email address</label>
                    <input
                        type='email'
                        className='form-control'
                        id='exampleInputEmail1'
                        aria-describedby='emailHelp'
                        placeholder='Enter email'
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                </div>

                <div className='form-group'>
                    <label for='exampleInputPrice'>Price </label>
                    <small id='exampleInputItemA' class='form-text text-muted'>
                        Item A
                    </small>
                    <input
                        type='number'
                        className='form-control'
                        id='exampleInputItemA'
                        aria-describedby='exampleInputItemA'
                        placeholder='Enter price for item A'
                        onChange={(e) => {
                            setItemA(e.target.value);
                        }}
                    />
                </div>
                <div className='form-group'>
                    <small id='exampleInputItemB' class='form-text text-muted'>
                        Item B
                    </small>
                    <input
                        type='number'
                        className='form-control'
                        id='exampleInputItemB'
                        aria-describedby='exampleInputItemB'
                        placeholder='Enter price for item B'
                        onChange={(e) => {
                            setItemB(e.target.value);
                        }}
                    />
                </div>
                <div className='form-group'>
                    <small id='exampleInputItemC' class='form-text text-muted'>
                        Item C
                    </small>
                    <input
                        type='number'
                        className='form-control'
                        id='exampleInputItemC'
                        aria-describedby='exampleInputItemC'
                        placeholder='Enter price for item C'
                        onChange={(e) => {
                            setItemC(e.target.value);
                        }}
                    />
                </div>
                <div className='form-group'>
                    <button
                        type='submit'
                        className='btn btn-primary'
                        onClick={handleCreate}
                    >
                        Generate Invoice
                    </button>
                </div>
                <div className='form-group'>
                    <button
                        type='submit'
                        className='btn btn-primary'
                        onClick={handleDownload}
                    >
                        View Invoice
                    </button>
                </div>
            </form>
        </>
    );
}

export default App;
