import { TouchableOpacity } from "react-native"

const Stage = ({ active = false, styles }) => {
  return <TouchableOpacity
            className={`bg-gray flex-1 rounded-[13px] ${active ? 'bg-primary' : ''}
            w-full h-[8px] ${styles}`}>
          </TouchableOpacity>
}

export default Stage;