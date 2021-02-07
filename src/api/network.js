import axios from 'axios'

export default function net (config) {
  const work = axios.create({
    timeout:30000,
    baseURL:'http://120.55.193.14:5000'
  })

  return work(config)
}