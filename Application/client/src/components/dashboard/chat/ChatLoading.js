import { Skeleton, Stack } from '@mui/material'
import React from 'react'

const ChatLoading = () => {
  return (
    <Stack>
        <Skeleton variant='text' height={45} />
        <Skeleton variant='text' height={45} />
        <Skeleton variant='text' height={45} />
        <Skeleton variant='text' height={45} />
        <Skeleton variant='text' height={45} />
        <Skeleton variant='text' height={45} />
        <Skeleton variant='text' height={45} />
    </Stack>
  )
}

export default ChatLoading