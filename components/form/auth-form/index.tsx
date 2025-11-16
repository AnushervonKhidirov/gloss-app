import { StyleSheet, View } from 'react-native';
import SignUpForm from '../sign-up-form';

const AuthForm = () => {
  return (
    <View style={styles.form_wrapper}>
      <SignUpForm />
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

export default AuthForm;
