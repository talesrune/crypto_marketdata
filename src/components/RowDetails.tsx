import { Box, Table } from '@chakra-ui/react';
import { binanceCryptoIcons } from 'binance-icons';
import parse from 'html-react-parser';

const RowDetails = ({ visibleItems, handlers }: { visibleItems: { symbol: string; name: string; price: number }[], handlers:any}) => {
  const checkIcon = (symbol: string) => {
    return binanceCryptoIcons.has(symbol);
  };
  return (
    <Table.Body {...handlers}>
      {visibleItems.map((item: any, index: number) => (
        <Table.Row key={item.name + index}>
          <Table.Cell textStyle={'2xl'} borderBottomColor={'bg'}>
            <Box display="flex" alignItems="center" gap={2}>
              {checkIcon(item.symbol.toLowerCase()) && (
                <div style={{ width: '32px', height: '32px' }}>
                  {parse(
                    binanceCryptoIcons.get(item.symbol.toLowerCase()) as string,
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
  );
};

export default RowDetails;
