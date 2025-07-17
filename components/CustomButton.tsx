import { StyleSheet, TouchableOpacity } from "react-native"
import { Text as StyledText } from "./Themed";

type ButtonProps = {
  onPress: () => void,
  title: string,
  color: string,
}

export default function CustomButton({ onPress, title, color }: ButtonProps) {

  const styles = StyleSheet.create({
    button: {
      margin: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 300,
      height: 75,
      backgroundColor: color,
    },
    title: {
      fontSize: 50,
    }
  })

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
    >
      <StyledText style={styles.title}>
        {title}
      </StyledText>
    </TouchableOpacity>
  )
}

