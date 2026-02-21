
import React, { useState } from "react";
import SmartAliasSidebar from "../../Component/SmartAliasSidebar";
import Swal from "sweetalert2"; // 🔹 import Swal

export function AddAlias(){

  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [transactionReference, setTransactionReference] = useState("");
  const [aliasName, setAliasName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");


  const generateTransactionReference = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = '';
  for (let i = 0; i < 12; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
};

  // Handle form submission
  const handleSubmit = async (e : any) => {
    e.preventDefault();

     const generatedReference = generateTransactionReference();

    const requestBody = {
      transactionType: "ALIAS_REGISTRATION", // Hardcoded field
      accountNumber: accountNumber || "", // Default value if not provided
      transactionReference: generatedReference,
      aliasAccountName: aliasName || "", // Default alias if not provided
      customerName: customerName || "", // Default name if not provided
      phoneNumber: mobileNumber || "", // Default phone number if not provided

    };

    try {
      const response = await fetch('https://testapidevops.creditbank.co.ke:3013/creditbank/api/v1/alias/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (response.ok) {
        // Show success message on successful response
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Alias Created for ${customerName}`,
          showConfirmButton: false,
          timer: 6000,
          width: 400,
        });

        
      }else {
      const errorMessage = result?.message || result?.data || "An unknown error occurred.";
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Error: ${errorMessage}`,
        showConfirmButton: false,
        timer: 6000,
        width: 400,
      });
    }
    } catch (error: any) {
    console.error('Error:', error);
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: `Error: ${error?.message || "An unexpected error occurred."}`,
      showConfirmButton: false,
      timer: 6000,
      width: 400,
    });
  }
  };
    return(
    
        <div className="flex min-h-screen bg-gradient-to-br from-purple-500 to-stone-300 font-inter">
                     <SmartAliasSidebar />

                       <div className="flex-1 p-8 bg-gray-100 min-h-screen">
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-800">Register Alias Account</h1>
                           <p className="text-sm text-gray-500 mt-1">Home / <span className="font-semibold text-gray-700">Register User</span></p>
                       </header>

            <div className="col">
                       <div className="logo w-100 shadow-lg p-3 bg-body rounded">
 	                               <div className="container text-center w-60">
               	                       <img width="150" height="50" src="https://creditbank.co.ke/wp-content/uploads/2023/04/New-Credit-Bank-Logo-1.png"/>
                                    </div>
                       </div>

                                           <form id="form" className="shadow-lg p-3 mb-5 bg-body rounded w-100" onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-sm">
                          <div className="form-outline mb-1">
                            <label className="form-label" htmlFor="FullNames">Customer Name</label>
                            <input
                              type="text"
                              id="FullNames"
                              className="form-control"
                              value={customerName}
                              onChange={(e) => setCustomerName(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="col-sm">
                          <div className="form-outline mb-1">
                            <label className="form-label" htmlFor="MobileNumber">Mobile Number</label>
                            <input
                              type="text"
                              id="MobileNumber"
                              className="form-control"
                              value={mobileNumber}
                              onChange={(e) => setMobileNumber(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-sm">
                          <div className="form-outline mb-1">
                            <label className="form-label" htmlFor="BeneficiaryName">Account Number</label>
                            <input
                              type="text"
                              id="BeneficiaryName"
                              className="form-control"
                              value={accountNumber}
                              onChange={(e) => setAccountNumber(e.target.value)}
                            />
                          </div>
                        </div>

                     <div className="col-sm">
                           <div className="form-outline mb-1">
                           <label className="form-label" htmlFor="Channel">Channel</label>
                      <input
                             type="text"
                             id="SwiftCode"
                             className="form-control"
                             value="Mobile"
                           disabled
                      />
  </div>
</div>

                      </div>

                      <div className="row">
                        <div className="col-sm">
                          <div className="form-outline mb-1">
                            <label className="form-label" htmlFor="AliasName">Alias Name</label>
                            <input
                              type="text"
                              id="AliasName"
                              className="form-control"
                              value={aliasName}
                              onChange={(e) => setAliasName(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="col-sm">
                          <div className="form-outline mb-1">
                            <label className="form-label" htmlFor="EmailAddress">Email Address</label>
                            <textarea
                              className="form-control"
                              id="EmailAddress"
                              value={emailAddress}
                              onChange={(e) => setEmailAddress(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col text-center">
                          <button
                            type="submit"
                            id="generate_btn"
                            className="btn btn-primary btn-sm btn-block mb-1"
                          >
                            Register Alias
                          </button>
                        </div>
                      </div>
                    </form>
           </div>

        
        </div>
        </div>
        
    )
}