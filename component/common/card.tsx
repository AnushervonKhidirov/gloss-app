import type { FC, PropsWithChildren, ReactElement, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { StyleSheet, Text, View } from 'react-native';

import { grey } from '@constant/theme';

type CardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

type CardBodyProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

type WithExtra = {
  content?: ReactNode;
  extra?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const Card: FC<CardProps> & {
  Header: FC<WithExtra & { thumb?: ReactElement }>;
  Body: FC<PropsWithChildren>;
  Footer: FC<WithExtra>;
} = ({ style = {} as any, children }) => {
  return <View style={{ ...styles.card, ...style }}>{children}</View>;
};

const CardHeader: FC<WithExtra & { thumb?: ReactElement }> = ({
  thumb,
  content,
  extra,
  style = {} as any,
}) => {
  return (
    <View style={{ ...styles.header, ...style }}>
      {thumb && <View>{thumb}</View>}
      <View style={{ flex: 1 }}>{content}</View>
      <View>{extra}</View>
    </View>
  );
};

const CardBody: FC<CardBodyProps> = ({ style = {} as any, children }) => {
  return <View style={{ ...styles.body, ...style }}>{children}</View>;
};

const CardFooter: FC<WithExtra> = ({ style = {} as any, content, extra }) => {
  return (
    <View style={{ ...styles.footer, ...style }}>
      <Text style={{ flex: 1, color: grey[7] }}>{content}</Text>
      <Text style={{ color: grey[7] }}>{extra}</Text>
    </View>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

const styles = StyleSheet.create({
  card: {
    borderColor: grey[2],
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
  },

  header: {
    paddingInline: 16,
    paddingBlock: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  body: {
    paddingInline: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: grey[2],
  },

  footer: {
    paddingInline: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    gap: 10,
  },
});

export default Card;
