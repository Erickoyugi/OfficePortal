import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import SmartAliasSidebar from "../../Component/SmartAliasSidebar";

interface AliasData {
  id: number;
  transactionType: string;
  accountNumber: string;
  transactionReference: string;
  aliasAccountName: string;
  customerName: string;
  phoneNumber: string;
  isArchived: string;
}

export function AliasList() {
  const [aliasList, setAliasList] = useState<AliasData[]>([]);

  // Add state to track which alias is being edited
  const [editingAlias, setEditingAlias] = useState<AliasData | null>(null);

  useEffect(() => {
    fetchAliasData();
  }, []);

  const fetchAliasData = async () => {
    try {
      const response = await axios.get(
        "https://testapidevops.creditbank.co.ke:3013/creditbank/api/v1/get/alias/list"
      );
      if (response.data && response.data.success) {
        setAliasList(response.data.data);
      } else {
        Swal.fire({
          icon: "error",
          title: "Fetch Failed",
          text: "Failed to retrieve alias data from the server.",
        });
      }
    } catch (error) {
      console.error("Error fetching alias list:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch data from the database. Please try again later.",
      });
    }
  };

  const handleUpdateAlias = async (id: number) => {
    Swal.fire({
      title: "Update Alias",
      html: `
        <input id="swal-account-number" class="swal2-input" placeholder="Account Number" value="${editingAlias?.accountNumber || ''}">
        <input id="swal-alias-name" class="swal2-input" placeholder="Alias Account Name" value="${editingAlias?.aliasAccountName || ''}">
      `,
      showCancelButton: true,
      confirmButtonText: "Update",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const accountNumber = (document.getElementById("swal-account-number") as HTMLInputElement).value;
        const aliasAccountName = (document.getElementById("swal-alias-name") as HTMLInputElement).value;
        if (!accountNumber || !aliasAccountName) {
          Swal.showValidationMessage("Both fields are required.");
          return false;
        }
        return { accountNumber, aliasAccountName };
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { accountNumber, aliasAccountName } = result.value;
          const response = await axios.post(
            `https://testapidevops.creditbank.co.ke:3013/creditbank/api/v1/alias/update`,
            { accountNumber, aliasAccountName }
          );

          if (response.data && response.data.message === "Alias successfully updated") {
            Swal.fire({
              icon: "success",
              title: "Updated!",
              text: `${response.data.message}`,
            });
            // Re-fetch data to show the updated list
            fetchAliasData();
          } else {
            Swal.fire({
              icon: "error",
              title: "Update Failed",
              text: response.data.error || "Failed to update alias data.",
            });
          }
        } catch (error) {
          console.error("Error updating alias:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: `Failed to update alias. Please try again later`,
          });
        }
      }
    });
  };

  // const handleDeleteAlias = (id: number) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#d33",
  //     cancelButtonColor: "#3085d6",
  //     confirmButtonText: "Yes, delete it!"
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       try {
  //         const response = await axios.post(
  //           `https://testapidevops.creditbank.co.ke:3013/creditbank/api/v1/alias/delete`
  //         );

  //         if (response.data && response.data.success) {
  //           Swal.fire({
  //             icon: "success",
  //             title: "Deleted!",
  //             text: "The alias has been deleted.",
  //           });
  //           // Remove the deleted item from the state to update the UI
  //           setAliasList(aliasList.filter((alias) => alias.id !== id));
  //         } else {
  //           Swal.fire({
  //             icon: "error",
  //             title: "Deletion Failed",
  //             text: "Failed to delete alias data.",
  //           });
  //         }
  //       } catch (error) {
  //         console.error("Error deleting alias:", error);
  //         Swal.fire({
  //           icon: "error",
  //           title: "Error",
  //           text: "Failed to delete alias. Please try again later.",
  //         });
  //       }
  //     }
  //   });
  // };

  const handleDeleteAlias = (id: number) => {
    // 1. Find the alias object we are trying to delete using the ID
    const aliasToDelete = aliasList.find(alias => alias.id === id);

    if (!aliasToDelete) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Alias record not found in the list.",
        });
        return; // Stop execution if the alias isn't found
    }
    
    // Extract the name the backend requires
    const { aliasAccountName } = aliasToDelete;

    Swal.fire({
      title: "Are you sure?",
      // You can make the text more specific:
      text: `You are about to delete the alias: ${aliasAccountName}. You won't be able to revert this!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `https://testapidevops.creditbank.co.ke:3013/creditbank/api/v1/alias/delete`,
            // ✅ FIX: Send the required data in the request body
            { aliasAccountName } 
          );

          // ... (Rest of your success/error handling logic)
          if (response.data.message === "Alias successfully archived.") {
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              // Re-fetch data to reflect the change on the active/archived tables
              text: `The alias '${aliasAccountName}' has been archived.`,
            });
            // We should call the global fetch function here to refresh BOTH tables
            fetchAliasData(); 
          } else {
            // ... (Handle backend-specific errors)
            Swal.fire({
              icon: "error",
              title: "Deletion Failed",
              text: response.data.message || "Failed to archive alias data.",
            });
          }
        } catch (error) {
          // ... (Handle network/request errors)
          console.error("Error archiving alias:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to archive alias. Please try again later.",
          });
        }
      }
    });
};

  const activeAliases = aliasList.filter((item) => item.isArchived === "0");
  const archivedAliases = aliasList.filter((item) => item.isArchived === "1");

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-500 to-stone-300 font-inter">
      <SmartAliasSidebar />

      <div className="flex-1 p-8 bg-gray-100 min-h-screen">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Registered Alias Account</h1>
          <p className="text-sm text-gray-500 mt-1">Home / <span className="font-semibold text-gray-700">Registered User</span></p>
        </header>

        <section className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Registered Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alias Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeAliases.map((alias) => (
                  <tr key={alias.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alias.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alias.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alias.phoneNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alias.accountNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alias.transactionType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alias.aliasAccountName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alias.transactionReference}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setEditingAlias(alias);
                          handleUpdateAlias(alias.id);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAlias(alias.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}