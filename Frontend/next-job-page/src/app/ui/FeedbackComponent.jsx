'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MessageCircle } from 'lucide-react'

export default function FeedbackComponent() {
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState('')

  // const handleSubmit = () => {
  //   // Here you would typically send the feedback to your server
  //   console.log('Feedback submitted:', feedback)
  //   setFeedback('')
  //   setIsOpen(false)

  // }

  const handleSubmit = async () => {
    // e.preventDefault();
    

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Anonymous', // You can replace this with a state variable if you have a name input field
        email: 'no-email-provided@example.com', // You can replace this with a state variable if you have an email input field
        message: feedback,
      }),
    });

    if (response.ok) {
      console.log('Feedback submitted:', feedback)
      setFeedback('')
      setIsOpen(false)
      // alert('Your Message Was sent successfully. Thanks for your feedback!');
    } else {
      const data = await response.json();
      // alert('Failed to send message. Please try again.');
    }
    
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0 bg-black drop-shadow-md border-white text-white"
        aria-label="Open feedback form"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}  >
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Send us your feedback</DialogTitle>
            <DialogDescription>
              How was your experience using our website? Please let us know if you encountered any issues or have any suggestions for improvement. 
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSdbLgxWSbBpn5k5HSSTReVikgw_7ALaF2cH_oWGMWVo8s8kyA/viewform?usp=sf_link" target='_blank' className='text-blue-500'> (or click here for full questionare)</a>
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Type your feedback here..."
            className="min-h-[100px] bg-slate-200 border-gray-500 "
          />
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleSubmit} > Submit Feedback</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}