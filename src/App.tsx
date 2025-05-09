import axios from 'axios';
import './App.css';
import {
  Box,
  Button,
  Checkbox,
  ClientOnly,
  HStack,
  Heading,
  Progress,
  RadioGroup,
  Skeleton,
  VStack,
  Input,
  Stack,
  For,
  Table,
} from '@chakra-ui/react';

const items = [
  { id: 1, name: 'Bitcoin', price: 100000.99 },
  { id: 2, name: 'Ethereum', price: 49.99 },
  { id: 3, name: 'Solana', price: 171.12 },
];
const App = () => {

  const callApi = async () => {
    await axios.get("https://api.binance.com/api/v3/ticker/price?symbols=%5B%22BTCUSDT%22,%22BNBUSDT%22%5D", {timeout:5000}).then(resp => {
    // await axios.get("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT", {timeout:5000}).then(resp => {
      console.log('works!')
      console.log(resp.data)
    }).catch(function (error) {
      console.log('error')
      console.log(error)
    });
  }
  return (
    <div className="content">
      <Box textAlign="center" fontSize="xl" pt="30vh" textStyle="body">
        <VStack gap="8">
          <Heading hidden size="2xl" letterSpacing="tight">
            Welcome to Chakra UI v3 + Vite
          </Heading>
          <div style={{ width: '40%', minWidth: '300px' }}>
            <Input placeholder="Type here..." />
          <Button onClick={callApi} colorScheme="teal" variant="solid">call</Button>
          <Stack gap="10">
            <Table.Root key={'sm'} size={'sm'}>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader style={{color:'#71717a'}} borderBottomColor={'bg'}>Name</Table.ColumnHeader>
                  {/* <For each={[1, 2, 3, 4, 5, 6]}>
                    {() => <Table.ColumnHeader borderBottomColor={'bg'}/>}
                  </For> */}
                  <Table.ColumnHeader style={{color:'#71717a'}} borderBottomColor={'bg'} textAlign="end">Price</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {items.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell borderBottomColor={'bg'}>{item.name}</Table.Cell>
                    {/* <For each={[1, 2, 3, 4, 5, 6]}>{() => <Table.Cell borderBottomColor={'bg'} />}</For> */}
                    <Table.Cell borderBottomColor={'bg'} textAlign="end">{item.price}</Table.Cell>
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
