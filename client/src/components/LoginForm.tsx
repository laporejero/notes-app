import { useState, useEffect, type JSX } from 'react'
import {
    Box,
    Button,
    Paper,
    Stack,
    TextField,
    Typography,
    Alert,
    CircularProgress
} from '@mui/material'
import axios from 'axios'

type LoginFormProps = {
    handleLogin: (username:string, password:string) => void
    goToRegister: () => void
    successMessage: string|null
    setSuccessMessage: (v: string|null) => void
} 

function LoginForm({ 
    handleLogin, 
    goToRegister, 
    successMessage, 
    setSuccessMessage 
}:LoginFormProps): JSX.Element {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [loginErr, setLoginErr] = useState<string|null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const submit = async (event:any) => {
        event.preventDefault()

        setLoading(true)

        try {
            await handleLogin(username, password)

            setUsername('')
            setPassword('')
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    setLoginErr('Invalid username and password')
                } else {
                    setLoginErr('Unable to connect to server. Please try again later')
                }
            } else {
                setLoginErr('Something went wrong')
            }
        } finally {
            setLoading(false)
        }
    }

    // login error message
    useEffect(() => {
        if (!loginErr) return
        const timer = setTimeout(() => {
            setLoginErr(null)
        }, 5000)

        return () => clearTimeout(timer)
    }, [loginErr])

    // register success message
    useEffect(() => {
        if (!successMessage) return

        const timer = setTimeout(() => {
            setSuccessMessage(null)
        }, 5000)

        return () => clearTimeout(timer)
    })

    return (
        <Box 
            component="form"
            onSubmit={submit}
            sx={{
            minHeight: "100vh",
            bgcolor: "#191919",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            px: 2,
        }}>
            <Paper
                elevation={0}
                sx={{
                    width: 400,
                    bgcolor: "#191919",
                    border: "1px solid rgb(50,50,50)",
                    borderRadius: 2,
                    p: 4,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}
            >
                <Stack spacing={3}>
                    <Typography
                        variant="h3"
                        sx={{
                            color: "rgb(232,232,232)",
                            fontSize: "var(--text-h3)",
                            fontWeight: "var(--font-weight-bold)",
                            fontFamily: "var(--font-family)",
                            letterSpacing: "var(--letter-spacing-tight)",
                            lineHeight: "var(--line-height-tight)",
                            textAlign: "center",
                        }}
                    >
                        Notes App
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: "rgb(165,165,165)",
                            textAlign: "center",
                            mt: -1,
                            fontSize: "var(--text-base)"
                        }}
                    >
                        Sign in to access your notes.
                    </Typography>

                    {successMessage && (
                        <Alert severity="success" sx={{ fontSize: "var(--text-base)" }}>
                            {successMessage}
                        </Alert>
                    )}

                    <TextField
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}

                        label="Username"
                        variant="outlined"
                        autoComplete="username"
                        fullWidth
                        required
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                color: "rgb(232,232,232)",

                                "& fieldset": {
                                borderColor: "rgb(80,80,80)",
                                },

                                "&:hover fieldset": {
                                borderColor: "rgb(165,165,165)",
                                },

                                "&.Mui-focused fieldset": {
                                borderColor: "rgb(232,232,232)",
                                },
                                fontSize: "var(--text-base)"
                            },

                            "& .MuiInputLabel-root": {
                                color: "rgb(165,165,165)",
                                fontSize: "var(--text-base)"
                            },

                            "& .MuiInputLabel-root.Mui-focused": {
                                color: "rgb(232,232,232)",
                            },
                        }}
                    />
                    <TextField
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}

                        label="Password"
                        type="password"
                        variant="outlined"
                        autoComplete="current-password"
                        fullWidth
                        required
                        sx={{
                        "& .MuiOutlinedInput-root": {
                            color: "rgb(232,232,232)",

                            "& fieldset": {
                            borderColor: "rgb(80,80,80)",
                            },

                            "&:hover fieldset": {
                            borderColor: "rgb(165,165,165)",
                            },

                            "&.Mui-focused fieldset": {
                            borderColor: "rgb(232,232,232)",
                            },
                            fontSize: "var(--text-base)"
                        },

                        "& .MuiInputLabel-root": {
                            color: "rgb(165,165,165)",
                            fontSize: "var(--text-base)"
                        },

                        "& .MuiInputLabel-root.Mui-focused": {
                            color: "rgb(232,232,232)",
                        },
                        }}
                    />
                    <Button
                        type="submit"
                        disabled={loading}
                        variant="outlined"
                        size="large"
                        sx={{
                            color: "rgb(232,232,232)",
                            borderColor: "rgb(165,165,165)",
                            py: 1.2,
                            fontWeight: "bold",
                            textTransform: "none",
                            fontSize: "var(--text-base)",

                            "&:hover": {
                                bgcolor: "rgb(232,232,232)",
                                color: "#191919",
                                borderColor: "rgb(232,232,232)",
                            },
                        }}
                    >
                        {loading ? (
                            <CircularProgress 
                                size={20} 
                                sx={{ color: "rgb(232,232,232)" }}
                            />
                        ) : (
                            'Sign In'
                        )}
                        
                    </Button>
                    {loginErr && (
                        <Alert 
                            severity='error'
                            sx={{ fontSize: "var(--text-base)" }}
                        >
                            {loginErr}
                        </Alert>
                        )
                    }

                    <Typography
                        sx={{
                            color: "rgb(165,165,165)",
                            textAlign: "center",
                            fontSize: "var(--text-base)"
                        }}
                        >
                        Don't have an account?
                        <Button
                            onClick={goToRegister}
                            sx={{ 
                                textTransform: "none",
                                fontSize: "var(--text-base)",
                                minWidth: 0,
                                p: 0,
                                ml: 0.5,

                                "&:hover": {
                                    backgroundColor: "transparent",
                                    color: "rgb(165,165,165)",
                                    textDecoration: "underline",
                                },
                            }}
                        >
                            Register
                        </Button>
                    </Typography>
                </Stack>
            </Paper>
        </Box>
    )
}

export default LoginForm