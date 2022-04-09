import React from 'react';


const Search = () => (
<form action="/ravintolat" method="get">
<label htmlFor="header-search">
    
</label>
<input
    type="text"
    id="header-search"
    placeholder="Hae ravintoloita "
    name="s" 
/>
<button type="submit">Hae</button>
</form>
);
export default Search;