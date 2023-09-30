/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import { updateBeerData } from './features/beerSlice';
import { useDispatch, useSelector } from 'react-redux';
import BeerPagination from './Pagination';
import Modal from 'react-bootstrap/Modal';
import './beerTable.css'
import Dropdown from 'react-bootstrap/Dropdown';



const BeerData = () => {

    const dispatch = useDispatch();
    const reduxState = useSelector((state) => state.tableData);

    const [pageNumber, setPageNumber] = useState(1);
    const [dataPerPage, setDataPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [sortedBeerData, setSortedBeerData] = useState([]);
    const [beforeAfterFilter, setBeforeAfterFilter] = useState({
        isBeforeAfter: '',
        date: ''
    })

    useEffect(() => {
        setLoading(true)
        fetchBeerData(pageNumber).then(response => {
            if (reduxState.beerData && !reduxState.beerData[pageNumber]) dispatch(updateBeerData({ page: pageNumber, data: response }));
            setSortedBeerData(response)
            setLoading(false)
        }).catch(e => {
            setLoading(false)

        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumber]);


    useEffect(() => {
        const validArr = reduxState.beerData && reduxState.beerData[pageNumber];
        if (beforeAfterFilter.date && beforeAfterFilter.isBeforeAfter) {
            const selectedDate = makeValidDate(beforeAfterFilter.date);
            if (validArr) {
                const filterData = validArr.filter((item) => {
                    const eachItemDate = makeValidDate(item.first_brewed);
                    return beforeAfterFilter.isBeforeAfter ==="before" ? selectedDate >eachItemDate : eachItemDate > selectedDate
                })
                setSortedBeerData(filterData)
            }
        } else setSortedBeerData(validArr)


    }, [beforeAfterFilter.date, beforeAfterFilter.isBeforeAfter,pageNumber,reduxState.beerData])


    async function fetchBeerData(pageNumber) {
        try {
            if (reduxState.beerData && reduxState.beerData[pageNumber]) {
                return reduxState.beerData[pageNumber];
            }

            const config = {
                method: "GET",
                url: `https://api.punkapi.com/v2/beers?page=${pageNumber}&per_page=10`
            }
            const data = await axios(config);
            if (data?.status === 200) return data.data
            throw new Error('Unable to fetch data')

        } catch (error) {
            return {
                status: false,
                message: error.message ? error.message : 'failed to fetch data',
            }
        }
    }


    const [sortOrder, setSortOrder] = useState('asc');
    function makeValidDate(dateString) {
        const dateArr = dateString.split('/');
        if (dateArr.length > 2) return new Date(dateString)
        const [month, year] = dateArr;
        return new Date(`${year}-${month}-01`)
    }
    const handleSortByDate = () => {
        const sortedData = [...sortedBeerData].sort((a, b) => {

            const dateA = makeValidDate(a.first_brewed);
            const dateB = makeValidDate(b.first_brewed);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
        setSortedBeerData(sortedData);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };


    if (loading) return <Modal
        show={loading}
        onHide={() => { }}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
    >
        <Modal.Body>
            <p>
                Getting the information for you...
            </p>
        </Modal.Body>

    </Modal>;

    function filterDropdown({ type, dataArr }) {

        return (<>
            <Dropdown className="d-inline mx-2">
                <Dropdown.Toggle id="dropdown-autoclose-true">
                    {beforeAfterFilter[type] || 'Select Value'}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {dataArr && dataArr.length && dataArr.map(v => <Dropdown.Item onClick={() => {
                        setBeforeAfterFilter((prev) => {
                            return {
                                ...prev,
                                [type]: v.value
                            }
                        })
                    }} key={v.value} href="#">{v.label}</Dropdown.Item>)}
                </Dropdown.Menu>
            </Dropdown>
        </>)
    }

    return (<>
        <div className='flexBox'>
            <p className="text-primary col-md-3 mx-auto">Information Overview</p>
            <p className='text-primary'>
                Apply Filter
            </p>
            {filterDropdown({ type: 'isBeforeAfter', dataArr: [{ label: 'First Brewed Before', value: 'before' }, { label: 'First Brewed After', value: 'after' }] })}
            {filterDropdown({
                type: 'date', dataArr: reduxState.beerData && reduxState.beerData[pageNumber] && reduxState.beerData[pageNumber].map(v => ({ value: v.first_brewed, label: v.first_brewed }))
            })}

        </div>
        <div className='custom-table'>
            <Table striped bordered hover size="sm">
                <thead className='fixedHeader'>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Tagline</th>
                        <th onClick={handleSortByDate} style={{ width: '103px' }}>
                            First Brewed
                            <div>
                                <i className={`fa-solid fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`} style={{ height: '10px', color: sortOrder === 'asc' ? '#000' : '#817979' }}></i>
                                <i className={`fa-solid fa-sort-${sortOrder === 'asc' ? 'down' : 'up'}`} style={{ color: sortOrder === 'asc' ? '#817979' : '#000' }}></i>
                            </div>
                        </th>
                        <th>Description</th>
                        <th>ABV</th>
                        <th>IBU</th>
                        <th>Food Pairing</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedBeerData.map(beer => (
                        <tr key={beer.id}>
                            <td>{beer.id}</td>
                            <td>{beer.name}</td>
                            <td>{beer.tagline}</td>
                            <td>{beer.first_brewed}</td>
                            <td>{beer.description}</td>
                            <td>{beer.abv}</td>
                            <td>{beer.ibu}</td>
                            <td>
                                <ul>
                                    {beer.food_pairing.map((pairing, index) => (
                                        <li key={index}>{pairing}</li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <img src={beer.image_url} alt="beer image" loading='lazy' style={{ width: '100px', height: '100px' }} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
        <div style={{
            display: 'flex',
            justifyContent: 'flex-end'
            , marginRight: '20px'
        }}>

            <BeerPagination
                totalItems={330}
                itemsPerPage={dataPerPage}
                activePage={pageNumber}
                onPageChange={(count) => {

                    setBeforeAfterFilter({
                        date: '',
                        isBeforeAfter: ''
                    })
                    setPageNumber(count)
                }}
            />
        </div>
    </>

    )
}

export default BeerData