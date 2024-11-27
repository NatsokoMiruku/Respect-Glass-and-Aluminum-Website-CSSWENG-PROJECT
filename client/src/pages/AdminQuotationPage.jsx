import { useEffect, useState } from 'react';
import ViewQuotations from '../components/ViewQuotations'; 
import Sidebar from '../components/Sidebar';
import '../css/AdminQuotationPage.css';

function AdminQuotationPage() {
    const [quotations, setQuotations] = useState([]);
    const [FilteredQuotations, setFilteredQuotations] = useState([]);
    const [arrange, setArrange] = useState(false);
    const [sort, setSorted] = useState("date");

    const toggleSort = () => {
      FilteredQuotations.reverse();
      setArrange(!arrange);
    }

    useEffect(() => {
      getquotations();
    }, []); 

    const getquotations = async() => {
        try{ 
          const res = await fetch("/api/request-quotation");
          const data = await res.json();
          setQuotations(data);
        }
       catch (err){
        console.error("Failed to fetch inventory", err);
      }
  }

    // Function to delete a quotation
    const deleteQuotation = async (id) => {
      try {
          await fetch(`/api/request-quotation/${id}`, { method: 'DELETE' }); // Adjust the API endpoint as necessary
          // Update the state to remove the deleted quotation
          setQuotations(quotations.filter(quotation => quotation._id !== id));
          console.log("Deleted");
      } catch (error) {
          console.error('Error deleting quotation:', error);
      }
  };


return(
    <div className='quotation-page'>
    <Sidebar />
    <div className='quotation-list'>
        {quotations.map((quotation) => { 
            return (
                <div key={quotation._id} className='quotation-item'> 
                    <ViewQuotations quotation={quotation} id={quotation._id} />
                    <button onClick={() => deleteQuotation(quotation._id)}>Delete</button>
                </div>
            )
        })}
    </div>
</div>
)
}

export default AdminQuotationPage;