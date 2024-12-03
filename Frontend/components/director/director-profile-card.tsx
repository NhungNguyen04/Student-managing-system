'use client'
import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Avatar } from "@/components/ui/avatar"
import accountApi from "@/apis/account"
import { useRouter } from 'next/router';
import { AvatarImage } from "@/components/ui/avatar"
import { create } from 'domain'

const DEFAULT_IMG = "/images/director.png"

export function DirectorProfileCard() {

    
    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [createdAt, setCreatedAt] = React.useState("")
    const [image,setImage] = React.useState("")
  
    useEffect( ()=>
    {
        const fetchAccountData = async() =>
        {
            const id = localStorage.getItem("userId");
            const response = await accountApi.getAccountById(id);
            setName(response.username);
            setEmail(response.email);
            setCreatedAt(new Date(response.createdAt).toISOString().slice(0,10) );
            setImage(response.image);
        }
        fetchAccountData();
    },[]
    
);


  return (
    
      <Tabs defaultValue="account" className="max-w-[600px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="flex w-auto">
              <div className="flex w-48">
                <Avatar className ="relative flex h-32 w-32 shrink-0 overflow-hidden rounded-full">
                  <AvatarImage src={image?image:DEFAULT_IMG} className="rounded-full border-[6px] border-[#E6EFFA]"/>
                </Avatar>
              </div>
              <div className="space-y-3">
                <h1></h1>
                <h1>Username: {name}</h1>
                <h1><p>Email: {email}</p></h1>
                <h1>Created Time: {createdAt}</h1>
              </div>

            </CardContent>
            
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
        
                Change your password here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    
  )
}