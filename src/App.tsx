import axios from 'axios';
import { useEffect, useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import './App.css';
import {
  Box,
  VStack,
  Input,
  Stack,
  Table,
  Pagination,
  ButtonGroup,
  IconButton,
  Heading,
} from '@chakra-ui/react';
import data from './assets/namelist.json'; // Import the JSON file
import RowDetails from './components/RowDetails';
import { useQuery } from '@tanstack/react-query';
import {
  TiArrowUnsorted,
  TiArrowSortedUp,
  TiArrowSortedDown,
  TiRefresh,
} from 'react-icons/ti';
import { MdOutlineLightbulb } from 'react-icons/md';
import { HiOutlineLightBulb } from 'react-icons/hi';
import { useSwipeable } from 'react-swipeable';
import { Theme } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';

const App = () => {
  // const queryClient = useQueryClient()
  const callApi = async () => {
    const symbolsForApi = visibleItems
      .filter((item) => item.disable === undefined)
      .map((item) => `${item.symbol}USDT`);
    // Convert the array to the required format for the API
    // const symbolsParam = JSON.stringify(symbolsForApi);
    const symbolsParam = `[${symbolsForApi.map((symbol) => `"${symbol}"`).join(',')}]`;
    // console.log(symbolsParam); // Output: ["BTCUSDT","SOLUSDT"]

    await axios
      .get(
        `https://api.binance.com/api/v3/ticker/price?symbols=${symbolsParam}`,
        // 'https://api.binance.com/api/v3/ticker/price?symbols=["BTCUSDT","SOLUSDT"]',
        { timeout: 5000 },
      )
      .then((resp) => {
        // await axios.get("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT", {timeout:5000}).then(resp => {
        // console.log(resp.data);
        const newItems = JSON.parse(JSON.stringify(items));
        resp.data.map((item: any) => {
          const symbol = item.symbol.split('USDT')[0];
          const target = newItems.find((obj: any) => symbol === obj.symbol);

          const source = {
            ...target,
            price: Number(item.price),
          };
          Object.assign(target, source); //it replaces the object in the array
        });
        setItems(newItems);
      })
      .catch(function (error) {
        console.log('error');
        console.log(error);
      });
  };

  const { refetch } = useQuery({
    queryKey: ['getpriceData'],
    queryFn: callApi,
    refetchInterval: 15000,
  });
  // console.log(result.data);

  const [items, setItems] = useState(data);
  const [filteredItems, setFilteredItems] = useState(items);
  const [searchTerm, setSearchTerm] = useState(''); // Search term
  const [page, setPage] = useState(1);
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [darkMode, setDarkMode] = useState(true);
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  // sort by name useState
  const [sortByNameOrder, setSortByNameOrder] = useState(0); // 0: default, 1: ascending, 2: descending
  const [sortByPriceOrder, setSortByPriceOrder] = useState(0); // 0: default, 1: ascending, 2: descending

  const pageSize = 14; // Number of items per page
  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  const visibleItems = filteredItems.slice(startRange, endRange);

  const filterItems = (items: any[], searchTerm: string) => {
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  };
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    //every time the input changes, set the page to 1
    setPage(1);
    setSortByNameOrder(0);
    setSortByPriceOrder(0);

    // Filter items based on name or symbol
    const itemsToFilter = filterItems(items, value);
    setFilteredItems(itemsToFilter);
  };

  const handleSortByName = (orderNum: Number, filteredOrNewItems: any) => {
    // console.log('!!!', orderNum);
    let sortedItems;
    if (orderNum === 0) {
      sortedItems = [...filteredOrNewItems].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      setFilteredItems(sortedItems);
    } else if (orderNum === 1) {
      sortedItems = [...filteredOrNewItems].sort((a, b) =>
        b.name.localeCompare(a.name),
      );
      setFilteredItems(sortedItems);
    } else if (orderNum === 2) {
      setFilteredItems(items);
    }
  };

  const handleSortByPrice = (orderNum: Number, filteredOrNewItems: any) => {
    // console.log('???', orderNum);
    let sortedItems;
    if (orderNum === 0) {
      //click happened
      sortedItems = [...filteredOrNewItems].sort((a, b) => a.price - b.price);
      setFilteredItems(sortedItems);
    } else if (orderNum === 1) {
      sortedItems = [...filteredOrNewItems].sort((a, b) => b.price - a.price);
      setFilteredItems(sortedItems);
    } else if (orderNum === 2) {
      setFilteredItems(items);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      // console.log(filteredItems.length/pageSize )
      // console.log(page)
      return page < filteredItems.length / pageSize
        ? setPage((prev) => prev + 1)
        : console.log('no next page');
    },
    onSwipedRight: () =>
      page !== 1
        ? setPage((prev) => prev - 1)
        : console.log('no previous page'),
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });
  useEffect(() => {
    if (searchTerm === '') {
      // console.log('sortByNameOrder', sortByNameOrder);
      // console.log('sortByPriceOrder', sortByPriceOrder);
      if (sortByNameOrder !== 0) {
        handleSortByName(sortByNameOrder - 1, items);
      } else if (sortByPriceOrder !== 0) {
        handleSortByPrice(sortByPriceOrder - 1, items);
      } else {
        setFilteredItems(items);
      }
    } else {
      const itemsToFilter = filterItems(items, searchTerm);
      setFilteredItems(itemsToFilter);
    }
  }, [items]);

  useEffect(() => {
    refetch();
  }, [page]);

  return (
    <ThemeProvider attribute="class" forcedTheme={darkMode ? 'dark' : 'light'}>
      <div className="content">
        <Box textAlign="center" pt="30vh" textStyle="body">
          <VStack gap="8">
            <div style={{ width: '40%', minWidth: '410px' }}>
              {isMobile ? (
                <Heading
                  color={'gray.600'}
                  fontFamily={'Outfit'}
                  textAlign={'start'}
                  size="sm"
                >
                  Psst! You can swipe left and right in mobile
                </Heading>
              ) : (
                <></>
              )}
              <Box display="flex" alignItems="center" gap={2}>
                <Input
                  size={'2xl'}
                  textStyle={'2xl'}
                  placeholder="Type here..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Box
                  as="button"
                  minWidth={'64px'}
                  height={'64px'}
                  onClick={() => {
                    refetch();
                  }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="md"
                  _hover={{ bg: darkMode ? '#18181b' : '#f4f4f5' }}
                >
                  <TiRefresh style={{ fontSize: '40px' }} />
                </Box>
                <Box
                  as="button"
                  minWidth={'64px'}
                  height={'64px'}
                  onClick={() => {
                    setDarkMode(!darkMode);
                  }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="md"
                  _hover={{ bg: darkMode ? '#18181b' : '#f4f4f5' }}
                >
                  {darkMode ? (
                    <HiOutlineLightBulb style={{ fontSize: '30px' }} />
                  ) : (
                    <MdOutlineLightbulb style={{ fontSize: '26px' }} />
                  )}
                </Box>
              </Box>
              <Stack gap="10">
                <Table.Root key={'lg'} size={'lg'}>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader
                        textStyle={'2xl'}
                        style={{ color: '#71717a' }}
                        borderBottomColor={'bg'}
                      >
                        <Box display="flex" alignItems="center" gap={2}>
                          Name
                          {sortByNameOrder === 0 && (
                            <TiArrowUnsorted
                              onClick={() => {
                                setTimeout(() => {
                                  refetch();
                                }, 300);
                                handleSortByName(0, filteredItems);
                                setSortByNameOrder(1);
                                setSortByPriceOrder(0);
                              }}
                              style={{ marginTop: '4px' }}
                              size={'20px'}
                            />
                          )}
                          {sortByNameOrder === 1 && (
                            <TiArrowSortedUp
                              onClick={() => {
                                setTimeout(() => {
                                  refetch();
                                }, 300);
                                handleSortByName(1, filteredItems);
                                setSortByNameOrder(2);
                                setSortByPriceOrder(0);
                              }}
                              style={{ marginTop: '4px' }}
                              size={'20px'}
                            />
                          )}
                          {sortByNameOrder === 2 && (
                            <TiArrowSortedDown
                              onClick={() => {
                                setTimeout(() => {
                                  refetch();
                                }, 300);
                                handleSortByName(2, filteredItems);
                                setSortByNameOrder(0);
                                setSortByPriceOrder(0);
                              }}
                              style={{ marginTop: '4px' }}
                              size={'20px'}
                            />
                          )}
                        </Box>
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        textStyle={'2xl'}
                        style={{ color: '#71717a' }}
                        borderBottomColor={'bg'}
                        textAlign="end"
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="flex-end"
                          gap={2}
                        >
                          Price
                          {sortByPriceOrder === 0 && (
                            <TiArrowUnsorted
                              onClick={() => {
                                setTimeout(() => {
                                  refetch();
                                }, 300);
                                handleSortByPrice(0, filteredItems);
                                setSortByPriceOrder(1);
                                setSortByNameOrder(0);
                              }}
                              style={{ marginTop: '4px' }}
                              size={'20px'}
                            />
                          )}
                          {sortByPriceOrder === 1 && (
                            <TiArrowSortedUp
                              onClick={() => {
                                setTimeout(() => {
                                  refetch();
                                }, 300);
                                handleSortByPrice(1, filteredItems);
                                setSortByPriceOrder(2);
                                setSortByNameOrder(0);
                              }}
                              style={{ marginTop: '4px' }}
                              size={'20px'}
                            />
                          )}
                          {sortByPriceOrder === 2 && (
                            <TiArrowSortedDown
                              onClick={() => {
                                setTimeout(() => {
                                  refetch();
                                }, 300);
                                handleSortByPrice(2, filteredItems);
                                setSortByPriceOrder(0);
                                setSortByNameOrder(0);
                              }}
                              style={{ marginTop: '4px' }}
                              size={'20px'}
                            />
                          )}
                        </Box>
                      </Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <RowDetails visibleItems={visibleItems} handlers={handlers} />
                </Table.Root>
              </Stack>
              <Pagination.Root
                count={filteredItems.length}
                pageSize={pageSize}
                page={page}
                onPageChange={(e) => setPage(e.page)}
              >
                <ButtonGroup variant="ghost" size="sm">
                  <Pagination.PrevTrigger asChild>
                    <IconButton>
                      <HiChevronLeft />
                    </IconButton>
                  </Pagination.PrevTrigger>

                  <Pagination.Items
                    render={(page) => (
                      <IconButton
                        variant={{ base: 'ghost', _selected: 'outline' }}
                      >
                        {page.value}
                      </IconButton>
                    )}
                  />

                  <Pagination.NextTrigger asChild>
                    <IconButton>
                      <HiChevronRight />
                    </IconButton>
                  </Pagination.NextTrigger>
                </ButtonGroup>
              </Pagination.Root>
            </div>
          </VStack>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default App;
