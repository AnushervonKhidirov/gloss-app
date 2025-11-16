import SignUpForm from '@components/form/sign-up-form';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

const SignUpScreen = () => {
  return (
    <View style={styles.form_wrapper}>
      <SignUpForm />
      <Link href='/sign-in'>Sign in</Link>
    </View>
  );
};

const styles = StyleSheet.create({
  form_wrapper: {
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
  },
});

export default SignUpScreen;
