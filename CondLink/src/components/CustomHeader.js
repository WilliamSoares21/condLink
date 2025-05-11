import { Appbar } from 'react-native-paper';
import { auth } from '../services/firebaseConfig';
import { signOut } from 'firebase/auth';

export default function CustomHeader({ navigation, title }) {
  return (
    <Appbar.Header>
      {navigation.canGoBack() && (
        <Appbar.BackAction onPress={() => navigation.goBack()} />
      )}
      <Appbar.Content title={title} />
      <Appbar.Action 
        icon="logout" 
        onPress={() => signOut(auth)} 
      />
    </Appbar.Header>
  );
}
