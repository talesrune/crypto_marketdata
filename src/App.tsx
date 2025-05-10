import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';
import { Box, Button, VStack, Input, Stack, Table } from '@chakra-ui/react';
import data from './assets/namelist.json'; // Import the JSON file
import { binanceCryptoIcons } from 'binance-icons';
import parse from 'html-react-parser';

const App = () => {
  const checkIcon = (symbol: string) => {
    return binanceCryptoIcons.has(symbol);
  };
  const callApi = async () => {
    await axios
      .get(
        'https://api.binance.com/api/v3/ticker/price?symbols=["BTCUSDT","SOLUSDT"]',
        { timeout: 5000 },
      )
      .then((resp) => {
        // await axios.get("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT", {timeout:5000}).then(resp => {
        console.log('works!');
        console.log(resp.data);
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

  const [items, setItems] = useState(data);
  const [filteredItems, setFilteredItems] = useState(items);
  const [searchTerm, setSearchTerm] = useState(''); // Search term

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

    // Filter items based on name or symbol
    const itemsToFilter = filterItems(items, value);
    setFilteredItems(itemsToFilter);
  };

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredItems(items);
    } else {
      const itemsToFilter = filterItems(items, searchTerm);
      setFilteredItems(itemsToFilter);
    }
  }, [items]);

  return (
    <div className="content">
      <Box textAlign="center" pt="30vh" textStyle="body">
        <VStack gap="8">
          <div style={{ width: '40%', minWidth: '410px' }}>
            <Input
              size={'2xl'}
              textStyle={'2xl'}
              placeholder="Type here..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <Button
              size={'2xl'}
              onClick={callApi}
              colorScheme="teal"
              variant="solid"
            >
              call
            </Button>
            <Stack gap="10">
              <Table.Root key={'lg'} size={'lg'}>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader
                      textStyle={'2xl'}
                      style={{ color: '#71717a' }}
                      borderBottomColor={'bg'}
                    >
                      Name
                    </Table.ColumnHeader>
                    {/* <For each={[1, 2, 3, 4, 5, 6]}>
                    {() => <Table.ColumnHeader borderBottomColor={'bg'}/>}
                  </For> */}
                    <Table.ColumnHeader
                      textStyle={'2xl'}
                      style={{ color: '#71717a' }}
                      borderBottomColor={'bg'}
                      textAlign="end"
                    >
                      Price
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredItems.map((item, index) => (
                    <Table.Row key={item.name + index}>
                      <Table.Cell textStyle={'2xl'} borderBottomColor={'bg'}>
                        <Box display="flex" alignItems="center" gap={2}>
                          {checkIcon(item.symbol.toLowerCase()) && (
                            <div style={{ width: '32px', height: '32px' }}>
                              {parse(
                                binanceCryptoIcons.get(
                                  item.symbol.toLowerCase(),
                                ) as string,
                              )}
                            </div>
                          )}
                          {item.name}
                        </Box>
                      </Table.Cell>
                      <Table.Cell
                        textStyle={'2xl'}
                        borderBottomColor={'bg'}
                        textAlign="end"
                      >
                        {item.price}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Stack>
          </div>
        </VStack>
      </Box>
    </div>
  );
};

export default App;
