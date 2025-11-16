import SignInForm from '@components/form/sign-in-form';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

const SignInScreen = () => {
  return (
    <View style={styles.form_wrapper}>
      <SignInForm />
      <Link href="/sign-up">Sign up</Link>
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

export default SignInScreen;
