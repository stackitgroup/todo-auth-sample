import Linkify from 'linkify-react'

type Props = {
  text: string
}

const TextWithLinks = ({ text }: Props) => {
  const options = {
    target: '_blank',
    rel: 'noopener noreferrer'
  }

  return <Linkify options={options}>{text}</Linkify>
}

export default TextWithLinks
