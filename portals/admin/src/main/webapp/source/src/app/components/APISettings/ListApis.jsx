/*
* Copyright (c) 2024, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 LLC. licenses this file to you under the Apache License,
* Version 2.0 (the "License"); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import API from 'AppData/api';
import { useIntl, FormattedMessage } from 'react-intl';
import ApisTableContent from 'AppComponents/APISettings/ApisTableContent';
import ApisTableHead from 'AppComponents/APISettings/ApisTableHead';
import Table from '@material-ui/core/Table';
import ContentBase from 'AppComponents/AdminPages/Addons/ContentBase';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';

/**
 * Render a list
 * @returns {JSX} Header AppBar components.
 */

const useStyles = makeStyles((theme) => ({
    searchBar: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    },
    block: {
        display: 'block',
    },
    clearSearch: {
        position: 'absolute',
        right: 111,
        top: 13,
    },
    addUser: {
        marginRight: theme.spacing(1),
    },
}));

export default function ListApis() {
    const intl = useIntl();
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [apiList, setApiList] = useState(null);
    const [totalApps, setTotalApps] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [provider, setProvider] = useState('');

    /**
    * API call to get api list
    * @returns {Promise}.
    */
    function apiCall(pageNo, query = provider) {
        setLoading(true);
        const restApi = new API();
        return restApi
            .getApiList({ limit: rowsPerPage, offset: pageNo * rowsPerPage, query })
            .then((result) => {
                setApiList(result.body.apis);
                const { pagination: { total } } = result.body;
                setTotalApps(total);
                return result.body.apis;
            })
            .catch((error) => {
                throw error;
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        apiCall(page).then((result) => {
            setApiList(result);
        });
    }, [page]);

    useEffect(() => {
        apiCall(page).then((result) => {
            setApiList(result);
        });
    }, [rowsPerPage]);

    function handleChangePage(event, pageNo) {
        setPage(pageNo);
        apiCall(pageNo).then((result) => {
            setApiList(result);
        });
    }

    function handleChangeRowsPerPage(event) {
        const nextRowsPerPage = event.target.value;
        const rowsPerPageRatio = rowsPerPage / nextRowsPerPage;
        const nextPage = Math.floor(page * rowsPerPageRatio);
        setPage(nextPage);
        setRowsPerPage(nextRowsPerPage);
        apiCall(page).then((result) => {
            setApiList(result);
        });
    }

    function clearSearch() {
        setPage(0);
        setProvider('');
        apiCall(page, '').then((result) => {
            setApiList(result);
        });
    }

    function setQuery(event) {
        const newQuery = event.target.value;
        if (newQuery === '') {
            clearSearch();
        } else {
            setProvider(newQuery);
        }
    }

    function filterApps(e) {
        e.preventDefault();
        setPage(0);
        apiCall(page).then((result) => {
            setApiList(result);
        });
    }

    return (
        <ContentBase>
            <AppBar className={classes.searchBar} position='static' color='default' elevation={0}>
                <Toolbar>
                    <form onSubmit={filterApps} style={{ width: '100%' }} disabled={loading}>
                        <Grid container spacing={2} alignItems='center'>
                            <Grid item>
                                <SearchIcon className={classes.block} color='inherit' />
                            </Grid>
                            <Grid item xs>
                                <TextField
                                    fullWidth
                                    id='search-label'
                                    label={intl.formatMessage({
                                        defaultMessage: 'Search by API',
                                        id: 'Apis.Listing.Listing.apis.search.label',
                                    })}
                                    placeholder={intl.formatMessage({
                                        defaultMessage: 'Api Name',
                                        id: 'Apis.Listing.Listing.search.placeholder',
                                    })}
                                    InputProps={{
                                        disableUnderline: true,
                                        className: classes.searchInput,
                                    }}
                                    value={provider}
                                    onChange={setQuery}
                                />
                                { provider.length > 0
                                && (
                                    <Tooltip
                                        title={
                                            intl.formatMessage({
                                                defaultMessage: 'Clear Search',
                                                id: 'Apis.Listing.Listing.clear.search',
                                            })
                                        }
                                    >
                                        <IconButton
                                            aria-label='delete'
                                            className={classes.clearSearch}
                                            onClick={clearSearch}
                                        >
                                            <HighlightOffRoundedIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Grid>
                            <Grid item>
                                <Button
                                    variant='contained'
                                    className={classes.addUser}
                                    type='submit'
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <FormattedMessage
                                            id='Apis.Listing.Listing.apis.searching'
                                            defaultMessage='Searching'
                                        />
                                    ) : (
                                        <FormattedMessage
                                            id='Apis.Listing.Listing.apis.search'
                                            defaultMessage='Search'
                                        />
                                    )}

                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Toolbar>
            </AppBar>
            {apiList && apiList.length > 0
                && (
                    <Table id='itest-api-list-table'>
                        <ApisTableHead />
                        <ApisTableContent
                            apis={apiList}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            editComponentProps={{
                                apiList,
                            }}
                            updateApiList={apiCall}
                        />
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    component='td'
                                    count={totalApps}
                                    rowsPerPage={rowsPerPage}
                                    rowsPerPageOptions={[5, 10, 15]}
                                    labelRowsPerPage='Show'
                                    page={page}
                                    backIconButtonProps={{
                                        'aria-label': 'Previous Page',
                                    }}
                                    nextIconButtonProps={{
                                        'aria-label': 'Next Page',
                                    }}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                )}
            {apiList && apiList.length === 0 && !loading && (
                <Box>
                    <Alert severity='info'>
                        <Typography variant='subtitle2'>
                            <FormattedMessage
                                id='Apis.Listing.Listing.empty.message'
                                defaultMessage='No Data to Display'
                            />
                        </Typography>
                    </Alert>
                </Box>
            )}
        </ContentBase>
    );
}
